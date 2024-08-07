"use client";

import { useForm, Controller } from "react-hook-form";
import { Button, Callout, Text, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/app/validationSchema";
import { z } from "zod";

type IssueForm = z.infer<typeof issueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(issueSchema),
  });

  return (
    <div className="max-w-2xl">
      {error && (
        <Callout.Root color="red" size="2" className="mb-5">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form
        className=" space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/issues", data);
            router.push("/issues");
          } catch (error) {
            setError("An unexpected error occurred.");
          }
        })}
      >
        <TextField.Root size="3" placeholder="Title" {...register("title")} />
        {errors && (
          <Text color="red" as="div">
            {errors.title?.message}
          </Text>
        )}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        {errors && (
          <Text color="red" as="div">
            {errors.description?.message}
          </Text>
        )}

        <Button size="3">Submit New Issue</Button>
      </form>
    </div>
  );
};

export default NewIssuePage;