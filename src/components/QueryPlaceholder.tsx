import { DefaultError, UseBaseQueryResult } from "@tanstack/react-query";
import React from "react";
import { Spinner } from "tamagui";

export default function <TData = unknown, TError = DefaultError>({
  query: { data, isError, isPending },
  renderData,
  spinnerSize,
}: {
  query: UseBaseQueryResult<TData, TError>;
  renderData: (data: TData) => React.ReactElement;
  spinnerSize?: "small" | "large";
}) {
  if (isPending) return <Spinner size={spinnerSize} color="$color11" />;
  if (isError) return <Spinner size={spinnerSize} color="$red11" />;
  if (data) return renderData(data);
}
