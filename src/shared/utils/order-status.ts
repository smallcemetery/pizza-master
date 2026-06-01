import { OrderStatus } from '@/generated/prisma';

const STAGE_DURATION_MS = 60_000;

const STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PREPARING,
  OrderStatus.DELIVERING,
  OrderStatus.COMPLETED,
];

export function getAutoOrderStatus(createdAt: Date, current: OrderStatus): OrderStatus {
  if (current === OrderStatus.CANCELLED || current === OrderStatus.COMPLETED) {
    return current;
  }

  const elapsed = Date.now() - createdAt.getTime();
  const stageIndex = Math.min(
    Math.floor(elapsed / STAGE_DURATION_MS),
    STATUS_FLOW.length - 1,
  );

  const target = STATUS_FLOW[stageIndex];
  const currentIndex = STATUS_FLOW.indexOf(current);

  if (currentIndex === -1) return target;
  return STATUS_FLOW[Math.max(currentIndex, stageIndex)] ?? target;
}
