import type { AboutSectionProps, ContentSegment } from '../screens/components/aboutSection/aboutSection';
import type { AboutSection, TextSegment } from '../screens/types';

function mapSegment(segment: TextSegment): ContentSegment {
  if (segment.type === 'highlight') {
    return { text: segment.value, color: 'blue' };
  }
  return segment.value;
}

/** Maps API about block to AboutSection component props. */
export function mapAboutToUiProps(about: AboutSection | undefined): AboutSectionProps | null {
  if (about == null) {
    return null;
  }

  const titleSegments =
    about.titleSegments != null && about.titleSegments.length > 0
      ? about.titleSegments.map(mapSegment)
      : undefined;

  const title =
    about.titleSegments?.map((s) => s.value).join('').trim() || 'About this service';

  const paragraphs =
    about.paragraphsSegments?.map((block) => block.segments.map(mapSegment)) ?? [];

  const tagline =
    about.taglineSegments != null && about.taglineSegments.length > 0
      ? about.taglineSegments.map(mapSegment)
      : undefined;

  if (paragraphs.length === 0 && titleSegments == null) {
    return null;
  }

  return {
    title,
    titleSegments,
    paragraphs,
    tagline,
  };
}
