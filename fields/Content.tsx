/* @jsx jsx */
import { HTMLAttributes } from 'react';
import { jsx, useTheme } from '@keystone-ui/core';
import { InfoIcon } from '@keystone-ui/icons/icons/InfoIcon';
import { AlertTriangleIcon } from '@keystone-ui/icons/icons/AlertTriangleIcon';
import { AlertOctagonIcon } from '@keystone-ui/icons/icons/AlertOctagonIcon';
import { CheckCircleIcon } from '@keystone-ui/icons/icons/CheckCircleIcon';
import { Trash2Icon } from '@keystone-ui/icons/icons/Trash2Icon';
import { Tooltip } from '@keystone-ui/tooltip';
import { component, fields } from '@keystone-next/fields-document/component-blocks';
import {
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from '@keystone-next/fields-document/primitives';

const noticeIconMap = {
  info: InfoIcon,
  error: AlertOctagonIcon,
  warning: AlertTriangleIcon,
  success: CheckCircleIcon,
};

const NotEditable = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <span css={{ userSelect: 'none' }} contentEditable={false} {...props}>
    {children}
  </span>
);

export const componentBlocks = {
  quote: component({
    component: ({ attribution, content }) => {
      return (
        <div
          css={{
            borderLeft: '3px solid #CBD5E0',
            paddingLeft: 16,
          }}
        >
          <div css={{ fontStyle: 'italic', color: '#4A5568' }}>{content}</div>
          <div css={{ fontWeight: 'bold', color: '#718096' }}>
            <NotEditable>— </NotEditable>
            {attribution}
          </div>
        </div>
      );
    },
    label: 'Quote',
    props: {
      content: fields.child({
        kind: 'block',
        placeholder: 'Quote...',
        formatting: { inlineMarks: 'inherit', softBreaks: 'inherit' },
        links: 'inherit',
      }),
      attribution: fields.child({ kind: 'inline', placeholder: 'Attribution...' }),
    },
    chromeless: true,
  }),
  notice: component({
    component: function Notice({ content, tone }) {
      const { palette, radii, spacing } = useTheme();
      const tones = {
        info: {
          background: palette.blue100,
          foreground: palette.blue700,
          icon: noticeIconMap.info,
        },
        error: {
          background: palette.red100,
          foreground: palette.red700,
          icon: noticeIconMap.error,
        },
        warning: {
          background: palette.yellow100,
          foreground: palette.yellow700,
          icon: noticeIconMap.warning,
        },
        success: {
          background: palette.green100,
          foreground: palette.green700,
          icon: noticeIconMap.success,
        },
      };
      const toneConfig = tones[tone.value];

      return (
        <div
          css={{
            borderRadius: radii.small,
            display: 'flex',
            paddingLeft: spacing.medium,
            paddingRight: spacing.medium,
          }}
          style={{
            background: toneConfig.background,
          }}
        >
          <NotEditable>
            <div
              css={{
                color: toneConfig.foreground,
                marginRight: spacing.small,
                marginTop: '1em',
              }}
            >
              <toneConfig.icon />
            </div>
          </NotEditable>
          <div css={{ flex: 1 }}>{content}</div>
        </div>
      );
    },
    label: 'Notice',
    chromeless: true,
    props: {
      tone: fields.select({
        label: 'Tone',
        options: [
          { value: 'info', label: 'Info' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
          { value: 'success', label: 'Success' },
        ] as const,
        defaultValue: 'info',
      }),
      content: fields.child({
        kind: 'block',
        placeholder: '',
        formatting: 'inherit',
        dividers: 'inherit',
        links: 'inherit',
        relationships: 'inherit',
      }),
    },
    toolbar({ props, onRemove }) {
      return (
        <ToolbarGroup>
          {props.tone.options.map(opt => {
            const Icon = noticeIconMap[opt.value];

            return (
              <Tooltip key={opt.value} content={opt.label} weight="subtle">
                {attrs => (
                  <ToolbarButton
                    isSelected={props.tone.value === opt.value}
                    onClick={() => {
                      props.tone.onChange(opt.value);
                    }}
                    {...attrs}
                  >
                    <Icon size="small" />
                  </ToolbarButton>
                )}
              </Tooltip>
            );
          })}

          <ToolbarSeparator />

          <Tooltip content="Remove" weight="subtle">
            {attrs => (
              <ToolbarButton variant="destructive" onClick={onRemove} {...attrs}>
                <Trash2Icon size="small" />
              </ToolbarButton>
            )}
          </Tooltip>
        </ToolbarGroup>
      );
    },
  }),

  product: component({
    label: 'Product',
    component: props => {
      return (
        <div>
          <div>{props.name}</div>
          <div>{props.title}</div>
          <div>{props.content}</div>
          {props.cta.discriminant ? (
            <div>
              <div>{props.cta.value.label}</div>
              <div>{props.cta.value.command}</div>
            </div>
          ) : null}
        </div>
      );
    },
    props: {
      name: fields.child({ kind: 'inline', placeholder: 'Product...' }),
      title: fields.child({ kind: 'inline', placeholder: 'Title...' }),
      content: fields.child({ kind: 'block', placeholder: '...' }),
      imageSrc: fields.text({
        label: 'Image URL',
        defaultValue: '',
      }),
      cta: fields.conditional(fields.checkbox({ label: 'Show Call to Action' }), {
        false: fields.empty(),
        true: fields.object({
          label: fields.child({ kind: 'inline', placeholder: '...' }),
          href: fields.url({ label: 'Call to action link' }),
          command: fields.child({ kind: 'inline', placeholder: '...' }),
        }),
      }),
    },
  }),
};
