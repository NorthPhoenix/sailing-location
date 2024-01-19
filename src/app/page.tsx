"use client";

import GoogleMap from "~/components/Map";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CardContent, Card } from "~/components/ui/card";
import Image from "next/image";
import { z } from "zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LocationOrderedList: React.FC<{ locations: string[] }> = ({
  locations,
}) => {
  return (
    <ol className="grid gap-4">
      {locations.map((location, index) => (
        <li key={index} className="w-full">
          <LocationListEntry index={index} location={location} />
        </li>
      ))}
    </ol>
  );
};

const LocationListEntry: React.FC<{ location: string; index: number }> = ({
  location,
  index,
}) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Image
          alt="Event 1"
          className="rounded-lg object-cover"
          height={80}
          src={`https://picsum.photos/80?random=${index}`}
          style={{
            aspectRatio: "80/80",
            objectFit: "cover",
          }}
          width={80}
        />
        <div className="space-y-1">
          <h3 className="font-semibold">{location}</h3>
          <p className="text-sm">Distance: 5 miles</p>
          <p className="text-sm">Date: January 25, 2024</p>
        </div>
      </CardContent>
    </Card>
  );
};

const ZipcodeForm: React.FC = () => {
  const formSchema = useMemo(
    () =>
      z.object({
        zipcode: z.string().min(5).max(5),
      }),
    [],
  );
  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipcode: "",
    },
  });

  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!values.zipcode) return;
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your zipcode" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="flex w-full flex-col items-stretch gap-3 p-4 md:w-1/3">
        <h1 className="text-2xl font-bold">Enter your Zipcode</h1>
        <ZipcodeForm />
        <div className="mt-4 w-full">
          <h2 className="text-xl font-bold">Locations Found:</h2>
          <LocationOrderedList
            locations={["location 1", "location 2", "location 3"]}
          />
        </div>
      </div>
      <div className="h-full w-full md:w-2/3">
        <GoogleMap />
      </div>
    </div>
  );
}
