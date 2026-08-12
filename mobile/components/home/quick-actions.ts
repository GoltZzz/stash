import type { ComponentType } from 'react';

import { AdjustIcon, PlusIcon, TrendIcon } from './cat-icons';

export type QuickActionId = 'add_expense' | 'review_spending' | 'adjust_budget';

export type QuickActionStatus = 'available' | 'coming_soon';

export type IconProps = {
  size?: number;
  color?: string;
};

export type QuickAction = {
  id: QuickActionId;
  title: string;
  subtitle: string;
  status: QuickActionStatus;
  icon: ComponentType<IconProps>;
  expandable?: boolean;
  badgeLabel?: string;
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'add_expense',
    title: 'Add Expense',
    subtitle: 'Take a treat from the jar',
    status: 'coming_soon',
    icon: PlusIcon,
  },
  {
    id: 'review_spending',
    title: 'Review Spending',
    subtitle: 'Count the crumbs trail',
    status: 'coming_soon',
    icon: TrendIcon,
  },
  {
    id: 'adjust_budget',
    title: 'Adjust Budget',
    subtitle: 'Refill and relabel the jar',
    status: 'available',
    icon: AdjustIcon,
    expandable: true,
    badgeLabel: 'Edit',
  },
];
