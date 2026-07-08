"use client";

import { Card, CardBody } from "@/components/ui/Card";

export default function LeaveBalanceCards({ balance }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {balance.map((b) => (
        <Card key={b.type}>
          <CardBody>
            <p className="text-xs font-medium text-secondary truncate">{b.type}</p>
            <p className="mt-1 text-xl font-bold text-primary">{b.remaining}<span className="text-sm font-normal text-secondary"> / {b.total}</span></p>
            <div className="mt-2 h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: `${b.total ? (b.remaining / b.total) * 100 : 0}%` }} />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}