import { isAddress } from 'viem';
import { Input } from '@chakra-ui/react';
import { FC, useEffect, useMemo, useState } from 'react';

export const AddressInput: FC<{
  handleUpdate: (value: string) => void;
  value?: string;
}> = ({ handleUpdate, value = '' }) => {
  const [updateValue, setUpdateValue] = useState<string>(value);
  const isInvalid = useMemo(
    () => !updateValue.length && !isAddress(updateValue),
    [updateValue]
  );
  useEffect(() => handleUpdate(updateValue), [updateValue]);

  return (
    <Input
      type="text"
      bg="black"
      borderColor={isInvalid ? 'red.500' : 'whiteAlpha.400'}
      is-invalid={isInvalid}
      placeholder="0x0000000000000000000000000000000000000000"
      value={value}
      onChange={(e) => {
        setUpdateValue(e.target.value);
      }}
      _focus={{
        borderColor: isInvalid ? 'red.500' : 'blue.300',
      }}
    />
  );
};
