import { defineField, type ImageOptions, type FieldDefinition } from 'sanity';

/**
 * Shared image field builders.
 *
 * WHY THESE ARE FUNCTIONS, NOT NAMED OBJECT TYPES
 * Every photo already in the dataset is stored with `_type: 'image'`. Wrapping
 * them in a named object type (`editorialImage`) would change `_type`, and the
 * Studio would show every existing photo as "Unknown type". Returning an inline
 * `{type: 'image', fields: [...]}` keeps `_type` as 'image', so existing photos
 * keep working and the new fields simply start out empty. No migration needed.
 */

interface ImageFieldOptions {
  name: string;
  title: string;
  description?: string;
  group?: string;
  /** Show a "Hide this photo" switch. Only for slots the design can render empty. */
  hideable?: boolean;
  /** Show a caption field. Most slots in this design have nowhere to print one. */
  captionable?: boolean;
  required?: boolean;
}

/** Alt text — what a screen reader announces, and what shows if the photo fails. */
const altField = defineField({
  name: 'alt',
  title: 'Photo description',
  description:
    'Describe what is in the photo, for visitors who cannot see it (and for Google). ' +
    'e.g. "A silversmith shaping a ring over an open flame". Leave blank to use the page heading.',
  type: 'localeString',
  validation: (Rule) => Rule.warning('Adding a description helps blind visitors and search engines.'),
});

const captionField = defineField({
  name: 'caption',
  title: 'Caption (optional)',
  description: 'Short text printed under the photo. Leave blank for no caption.',
  type: 'localeString',
});

const hiddenField = defineField({
  name: 'hidden',
  title: 'Hide this photo',
  description: 'Turn on to take the photo off the website without deleting it.',
  type: 'boolean',
  initialValue: false,
});

function extraFields(options: ImageFieldOptions): FieldDefinition[] {
  const fields: FieldDefinition[] = [altField as FieldDefinition];
  if (options.captionable) fields.push(captionField as FieldDefinition);
  if (options.hideable) fields.push(hiddenField as FieldDefinition);
  return fields;
}

const HOTSPOT_HINT =
  'After uploading, use the crop tool to choose which part of the photo stays visible ' +
  'when it is trimmed to fit — drag the circle over the part that matters most.';

/**
 * A photo slot whose frame is fixed by the page design (hero panels, dark
 * bands). The owner controls the photo and its focal point, but not its size —
 * exposing a size control here would break the layout.
 */
export function imageField(options: ImageFieldOptions) {
  return defineField({
    name: options.name,
    title: options.title,
    description: options.description
      ? `${options.description} ${HOTSPOT_HINT}`
      : HOTSPOT_HINT,
    type: 'image',
    group: options.group,
    options: { hotspot: true } satisfies ImageOptions,
    fields: extraFields(options),
    validation: options.required ? (Rule) => Rule.required() : undefined,
  });
}

/**
 * A photo slot the design can render at more than one shape — currently the
 * Our Story gallery. `shape` is an enumerated list, never a pixel value, so an
 * unusable size cannot be entered.
 */
export function sizedImageField(options: ImageFieldOptions) {
  const base = imageField(options);
  return defineField({
    ...base,
    fields: [
      ...(base.fields ?? []),
      defineField({
        name: 'shape',
        title: 'Photo shape',
        description: 'How the photo is framed on the page.',
        type: 'string',
        initialValue: 'square',
        options: {
          list: [
            { title: 'Square', value: 'square' },
            { title: 'Landscape (wide)', value: 'landscape' },
            { title: 'Portrait (tall)', value: 'portrait' },
            { title: 'Original shape', value: 'original' },
          ],
          layout: 'radio',
        },
      }),
    ],
  });
}

/** The same slot as `imageField`, for use inside an array (`of: [...]`). */
export function imageMember(options: { captionable?: boolean; hideable?: boolean } = {}) {
  return {
    type: 'image' as const,
    options: { hotspot: true } satisfies ImageOptions,
    fields: extraFields({ name: 'image', title: 'Photo', ...options }),
    preview: {
      select: { media: 'asset', title: 'alt.id', caption: 'caption.id', hidden: 'hidden' },
      prepare({ media, title, caption, hidden }: Record<string, unknown>) {
        return {
          media: media as never,
          title: (title as string) || 'Photo',
          subtitle: hidden ? 'Hidden' : ((caption as string) ?? undefined),
        };
      },
    },
  };
}
