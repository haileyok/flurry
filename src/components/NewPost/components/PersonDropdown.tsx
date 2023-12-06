import React, { useEffect, useRef, useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { IPerson } from '@src/types/data';
import Avatar from '@src/components/Common/Profile/Avatar';
import { LayoutAnimation } from 'react-native';
import { useClient } from '@root/App';

interface IProps {
  term: string;
  onSelect: (person: IPerson) => void;
}

export default function PersonDropdown({
  term,
  onSelect,
}: IProps): React.JSX.Element | null {
  const client = useClient();

  const [persons, setPersons] = useState<IPerson[]>([]);

  const loading = useRef(false);

  useEffect(() => {
    if (loading.current) return;

    if (!term || term.length < 3) {
      setPersons([]);
      return;
    }

    const search = async (): Promise<void> => {
      const transformer = client.getTransformer();

      loading.current = true;
      const res = await client.getPersonSuggestions(term);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPersons(res.actors.map((p) => transformer.transformPerson(p)));
      loading.current = false;
    };

    void search();
  }, [term]);

  if (!term || term.length < 3) return null;

  return (
    <YStack space="$2">
      {persons.map((p, index) => (
        <XStack
          paddingVertical="$2"
          paddingHorizontal="$1"
          key={p.id}
          alignItems="center"
          space="$2"
          borderColor="$border"
          borderBottomWidth={index !== persons.length - 1 ? 1 : 0}
          onPress={() => onSelect(p)}
          hitSlop={3}
          backgroundColor="$bg"
        >
          <Avatar size={28} pressAction="none" avatar={p.avatar} />
          <Text fontSize="$3" flex={1} numberOfLines={1}>
            <Text fontWeight="bold">{p.displayName}</Text>
            <Text fontSize="$2"> @{p.handle}</Text>
          </Text>
        </XStack>
      ))}
    </YStack>
  );
}
