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
import { useEffect, useState } from "react";
import {
  ComboBoxItemType,
  ComboSearchBox,
  SearchResponse,
} from "@/components/extensions/ComboSearchBox/ComboSearchBox";
import React from "react";

const formValidationFn = () => {
  return z.object({
    name: z.string(),
  });
};

const formValidation = formValidationFn();

async function serviceMock(): Promise<IFormData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: "Gabriel Santos" }), 1000);
  });
}
export type IFormData = z.infer<typeof formValidation>;

export default function CurrencyInputPage() {
  const form = useForm({
    resolver: zodResolver(formValidation),
  });

  const [initialData, setInitialData] = useState<IFormData>();
  const [remount, set] = React.useState(0);
  const remountKey = () => set((s) => s + 1);

  const onSubmit = form.handleSubmit(async () => {
    window.alert("Criado com sucesso");
  });

  async function fetchInitialData() {
    const res = await serviceMock();
    form.reset(res);
    setInitialData(res);
    remountKey();
  }

  useEffect(() => {
    fetchInitialData();
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
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-12 h-fit md:col-span-6 lg:col-span-6">
                  <FormLabel>Valor:</FormLabel>
                  <ComboSearchBox
                    key={remount}
                    queryKey="name"
                    initialValue={
                      {
                        label: initialData?.name,
                        value: initialData?.name,
                      } as ComboBoxItemType
                    }
                    className="w-full "
                    onSelect={(
                      selected: string,
                      items: SearchResponse | undefined
                    ) => {
                      console.log(
                        `Valor do item selecionado: ${selected} se necessário`
                      );
                      console.log(
                        `Valor dos itens atuais: ${items} se necessário`
                      );

                      field.onChange(selected);
                    }}
                    asyncSearchFn={async (search: string) => {
                      console.log(
                        `Valor do termo procurado para fetch ${search}`
                      );
                      const data = await new Promise((resolve) => {
                        setTimeout(
                          () =>
                            resolve([
                              {
                                name: "Gabriel Santos",
                                id: crypto.randomUUID(),
                              },
                              {
                                name: "Amanda Arantes",
                                id: crypto.randomUUID(),
                              },
                            ]),
                          1000
                        );
                      });

                      const opts = (data as any[]).map((s) => ({
                        label: s.name,
                        value: s.id,
                      }));

                      return { limit: 10, options: opts, skip: 1, total: 10 };
                    }}
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
