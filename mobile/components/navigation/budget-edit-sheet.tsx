import React from 'react';
import StackedSheet from './stacked-sheet';
import BudgetEditForm from '../home/budget-edit-form';
import { useSheetStack } from './sheet-stack-context';

type BudgetEditSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
};

export default function BudgetEditSheet({ visible, onClose, onSaveSuccess }: BudgetEditSheetProps) {
  const { dismissAll } = useSheetStack();

  const handleSaveSuccess = () => {
    // Close the sheet stack
    dismissAll();
    // Callback to trigger success haptics & toast in parent/tab bar
    onSaveSuccess();
  };

  return (
    <StackedSheet
      visible={visible}
      onClose={onClose}
      title="Refill the Jar"
    >
      <BudgetEditForm onSaveSuccess={handleSaveSuccess} />
    </StackedSheet>
  );
}
