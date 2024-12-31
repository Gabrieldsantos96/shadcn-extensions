"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { MaskedInput } from "@/components/extensions/MaskedInput";

const formValidationFn = () => {
  return z.object({
    cpf: z.string(),
  });
};

const formValidation = formValidationFn();

export type IFormData = z.infer<typeof formValidation>;

export default function CurrencyInputPage() {
  const form = useForm({
    resolver: zodResolver(formValidation),
  });

  const onSubmit = form.handleSubmit(async () => {
    window.alert("Criado com sucesso");
  });

  async function serviceMock(): Promise<IFormData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ cpf: "8324872390432" }), 1000);
    });
  }

  async function fetchData() {
    const res = await serviceMock();
    form.reset(res);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Card className="flex flex-col p-2">
        <CardHeader className="mb-2 space-y-4">
          <CardTitle className="text-3xl"></CardTitle>
          <h6 className="mb-3 mt-1 text-muted-foreground">
            Insira os dados do usuário abaixo.
          </h6>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-12 gap-x-4 gap-y-8 p-2"
          >
            <h4 className="col-span-12 font-bold">Dados do Usuário</h4>

            <FormField
              name="cpf"
              render={({ field }) => (
                <FormItem className="col-span-12 h-fit md:col-span-6 lg:col-span-6">
                  <FormLabel>CPF:</FormLabel>
                  <MaskedInput
                    mask="999.999.9999/9"
                    initialValue={field.value}
                    type="text"
                    placeholder="Digite"
                    onCallback={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-12 flex items-end justify-end">
              <Button
                type="button"
                className="float-end ms-4"
                variant="default"
                size="lg"
              >
                Cancelar
              </Button>
              <Button className="float-end ms-4" type="submit" size="lg">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";