import { useOnboardingForm } from '@/components/onboarding/use-onboarding-form';
import {
  CURRENCIES,
  PERIOD_OPTIONS,
  type BudgetPeriodType,
  type Currency,
} from '@/features/budgets/types';
import { Pressable, Text, TextInput, View } from '@/tw';

export default function BudgetOnboardingForm() {
  const { values, updateValues, submit, submitting, error, isValid } =
    useOnboardingForm();
  const showCustomDays = values.periodType === 'custom';

  return (
    <View className="flex-1 bg-sf-bg px-6 py-8">
      <View className="mb-8 gap-2">
        <Text className="text-3xl font-bold text-sf-text">Welcome to Stash</Text>
        <Text className="text-base text-sf-text-2">
          Set your first budget to get started.
        </Text>
      </View>

      <View className="gap-5">
        <View className="gap-2">
          <Text className="text-sm font-medium text-sf-text-2">Budget amount</Text>
          <TextInput
            className="rounded-xl border border-sf-gray/30 bg-sf-bg-2 px-4 py-3 text-base text-sf-text"
            value={values.amount}
            onChangeText={(amount) => updateValues({ amount })}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#8e8e93"
          />
        </View>

        <CurrencyPicker
          value={values.currency}
          onChange={(currency) => updateValues({ currency })}
        />

        <View className="gap-2">
          <Text className="text-sm font-medium text-sf-text-2">Budget period</Text>
          <View className="flex-row flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const selected = values.periodType === option.value;
              return (
                <Pressable
                  key={option.value}
                  className={`rounded-full px-4 py-2 ${
                    selected ? 'bg-sf-blue' : 'bg-sf-bg-2'
                  }`}
                  onPress={() =>
                    updateValues({ periodType: option.value as BudgetPeriodType })
                  }>
                  <Text
                    className={`text-sm font-medium ${
                      selected ? 'text-white' : 'text-sf-text'
                    }`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {showCustomDays ? (
          <View className="gap-2">
            <Text className="text-sm font-medium text-sf-text-2">
              Custom period (days)
            </Text>
            <TextInput
              className="rounded-xl border border-sf-gray/30 bg-sf-bg-2 px-4 py-3 text-base text-sf-text"
              value={values.periodDays}
              onChangeText={(periodDays) => updateValues({ periodDays })}
              keyboardType="number-pad"
              placeholder="30"
              placeholderTextColor="#8e8e93"
            />
          </View>
        ) : null}
      </View>

      {error ? (
        <Text className="mt-4 text-sm text-sf-red">{error}</Text>
      ) : null}

      <Pressable
        className={`mt-8 items-center rounded-xl px-4 py-3 ${
          isValid && !submitting ? 'bg-sf-blue' : 'bg-sf-gray/40'
        }`}
        disabled={!isValid || submitting}
        onPress={submit}>
        <Text className="text-base font-semibold text-white">
          {submitting ? 'Saving...' : 'Continue'}
        </Text>
      </Pressable>
    </View>
  );
}

function CurrencyPicker({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (currency: Currency) => void;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-sf-text-2">Currency</Text>
      <View className="flex-row gap-2">
        {CURRENCIES.map((currency) => {
          const selected = value === currency;
          return (
            <Pressable
              key={currency}
              className={`rounded-full px-4 py-2 ${
                selected ? 'bg-sf-blue' : 'bg-sf-bg-2'
              }`}
              onPress={() => onChange(currency)}>
              <Text
                className={`text-sm font-medium ${
                  selected ? 'text-white' : 'text-sf-text'
                }`}>
                {currency}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
