import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        {/* AJUSTE: tamanho do titulo */}
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}