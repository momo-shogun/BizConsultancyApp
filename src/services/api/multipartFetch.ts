import { Platform } from 'react-native';
import type { Asset } from 'react-native-image-picker';

import { API_BASE_URL } from '@/constants/api';

export interface MultipartFilePayload {
  uri: string;
  name: string;
  type: string;
}

export interface MultipartUploadResult {
  ok: boolean;
  status: number;
  data: unknown;
}

const UPLOAD_TIMEOUT_MS = 120_000;

function joinApiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/** Prefer cache/file paths so RN can attach the file to multipart requests. */
export function resolveUploadFileUri(asset: Asset): string {
  if (Platform.OS === 'android') {
    const originalPath = asset.originalPath?.trim();
    if (originalPath != null && originalPath.length > 0) {
      if (originalPath.startsWith('file://')) {
        return originalPath;
      }
      if (originalPath.startsWith('/')) {
        return `file://${originalPath}`;
      }
      return originalPath;
    }
  }

  const uri = asset.uri?.trim() ?? '';
  if (uri.length === 0) {
    return uri;
  }

  if (Platform.OS === 'ios') {
    if (
      uri.startsWith('file://') ||
      uri.startsWith('ph://') ||
      uri.startsWith('assets-library://')
    ) {
      return uri;
    }
    return uri.startsWith('/') ? `file://${uri}` : uri;
  }

  return uri;
}

export function assetToMultipartFile(
  asset: Asset,
  uploadFilename: string,
  mimeType: string,
): MultipartFilePayload {
  const fallbackName =
    asset.fileName?.trim() ||
    `upload_${Date.now()}${mimeType === 'image/png' ? '.png' : '.jpg'}`;

  return {
    uri: resolveUploadFileUri(asset),
    name: uploadFilename || fallbackName,
    type: mimeType,
  };
}

function buildFormData(
  fields: Record<string, string>,
  fileFieldName: string,
  file: MultipartFilePayload,
): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  formData.append(fileFieldName, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
  return formData;
}

function parseResponseBody(rawText: string): unknown {
  if (rawText.length === 0) {
    return null;
  }
  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    return { message: rawText };
  }
}

/**
 * RN `fetch` often fails on multipart file bodies ("Network request failed").
 * XMLHttpRequest is the reliable path used by most RN upload implementations.
 */
function postMultipartFormWithXhr(
  url: string,
  formData: FormData,
  token: string | null,
): Promise<MultipartUploadResult> {
  return sendMultipartFormWithXhr('POST', url, formData, token);
}

export async function postMultipartForm(
  path: string,
  fields: Record<string, string>,
  fileFieldName: string,
  file: MultipartFilePayload,
  token: string | null,
): Promise<MultipartUploadResult> {
  const formData = buildFormData(fields, fileFieldName, file);
  const url = joinApiUrl(path);
  return postMultipartFormWithXhr(url, formData, token);
}

function buildFieldsFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value.length > 0) {
      formData.append(key, value);
    }
  }
  return formData;
}

function sendMultipartFormWithXhr(
  method: 'POST' | 'PATCH',
  url: string,
  formData: FormData,
  token: string | null,
): Promise<MultipartUploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.setRequestHeader('Accept', 'application/json');
    if (token != null && token.length > 0) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.onload = (): void => {
      const rawText = xhr.responseText ?? '';
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        data: parseResponseBody(rawText),
      });
    };

    xhr.onerror = (): void => {
      resolve({
        ok: false,
        status: 0,
        data: {
          message:
            'Network request failed. Check your internet connection and that the app can reach the API server.',
        },
      });
    };

    xhr.ontimeout = (): void => {
      resolve({
        ok: false,
        status: 0,
        data: { message: 'Upload timed out. Please try again.' },
      });
    };

    try {
      xhr.send(formData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed';
      resolve({
        ok: false,
        status: 0,
        data: { message },
      });
    }
  });
}

/** PATCH multipart with a JSON blob field (e.g. consultant profile `payload`). */
export async function patchMultipartJsonPayload(
  path: string,
  payloadFieldName: string,
  payload: unknown,
  fileFieldName: string | null,
  file: MultipartFilePayload | null,
  token: string | null,
): Promise<MultipartUploadResult> {
  const formData = new FormData();
  formData.append(payloadFieldName, JSON.stringify(payload));
  if (file != null && fileFieldName != null) {
    formData.append(fileFieldName, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
  }
  const url = joinApiUrl(path);
  return sendMultipartFormWithXhr('PATCH', url, formData, token);
}

/** PATCH multipart (e.g. `users/me` profile + optional image file). */
export async function patchMultipartForm(
  path: string,
  fields: Record<string, string>,
  fileFieldName: string | null,
  file: MultipartFilePayload | null,
  token: string | null,
): Promise<MultipartUploadResult> {
  const formData = buildFieldsFormData(fields);
  if (file != null && fileFieldName != null) {
    formData.append(fileFieldName, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
  }
  const url = joinApiUrl(path);
  return sendMultipartFormWithXhr('PATCH', url, formData, token);
}
