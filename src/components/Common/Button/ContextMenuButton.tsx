import * as DropdownMenu from 'zeego/dropdown-menu';
import Ellipsis from '@src/components/Common/BlahBlahBlah/Ellipsis';
import React from 'react';
import { IContextMenuActionGroup } from '@src/types/IContextMenuAction';
import { useTheme } from 'tamagui';
import PressInAnimation from '@src/components/Common/Animation/PressInAnimation';

interface IProps {
  size?: number;
  actions: IContextMenuActionGroup[];
  children?: React.ReactElement;
}

/**
 * Pass children for a custom icon/button, otherwise an ellipsis will be used.
 * @param size
 * @param groups
 * @param children
 * @constructor
 */
export default function ContextMenuButton({
  size = 20,
  actions: groups,
  children,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {children ?? (
          <PressInAnimation>
            <Ellipsis size={size} color={theme.secondary.val as string} />
          </PressInAnimation>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {groups.map((group) => (
          <DropdownMenu.Group key={group.key}>
            {group.actions.map((action) => {
              if (action.actions != null) {
                return (
                  <DropdownMenu.Sub key={action.key}>
                    <DropdownMenu.SubTrigger
                      key={action.key + 'trigger'}
                      destructive={action.destructive}
                    >
                      {action.label}
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent key={action.key + 'dropdown'}>
                      {action.actions.map((subAction) => {
                        return (
                          <DropdownMenu.Item
                            key={subAction.key}
                            onSelect={subAction.onSelect}
                            destructive={subAction.destructive}
                          >
                            <DropdownMenu.ItemTitle>
                              {subAction.label}
                            </DropdownMenu.ItemTitle>
                            <DropdownMenu.ItemIcon
                              ios={{ name: subAction.iconName! }}
                            />
                          </DropdownMenu.Item>
                        );
                      })}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                );
              } else {
                return (
                  <DropdownMenu.Item
                    key={action.key}
                    onSelect={action.onSelect}
                    destructive={action.destructive}
                  >
                    <DropdownMenu.ItemTitle>
                      {action.label}
                    </DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon ios={{ name: action.iconName! }} />
                  </DropdownMenu.Item>
                );
              }
            })}
          </DropdownMenu.Group>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
