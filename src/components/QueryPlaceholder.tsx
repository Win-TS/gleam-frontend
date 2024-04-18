import { DefaultError, UseBaseQueryResult } from "@tanstack/react-query";
import React from "react";
import { Spinner } from "tamagui";

type QueryPlaceholderProps<TData, TError> = {
  query: UseBaseQueryResult<TData, TError>;
  spinnerSize?: "small" | "large";
} & (
  | {
      renderData: (data: TData) => React.ReactNode;
      renderSpinner?: false;
    }
  | {
      renderData: (
        data:
          | { data: TData; spinner: undefined }
          | { data: undefined; spinner: () => React.ReactNode },
      ) => React.ReactNode;
      renderSpinner: true;
    }
);

export default function <TData = unknown, TError = DefaultError>({
  query: { data, isError, isPending },
  renderData,
  spinnerSize,
  renderSpinner,
}: QueryPlaceholderProps<TData, TError>) {
  if (isPending)
    return renderSpinner ? (
      renderData({
        data: undefined,
        spinner: () => <Spinner size={spinnerSize} color="$color11" />,
      })
    ) : (
      <Spinner size={spinnerSize} color="$color11" />
    );
  if (isError)
    return renderSpinner ? (
      renderData({
        data: undefined,
        spinner: () => <Spinner size={spinnerSize} color="$red10" />,
      })
    ) : (
      <Spinner size={spinnerSize} color="$red10" />
    );
  return renderSpinner
    ? renderData({ data, spinner: undefined })
    : renderData(data);
}
