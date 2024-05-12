import { Portal } from "@gorhom/portal";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <Portal
      hostName={
        process.env.EXPO_PUBLIC_STORYBOOK_ENABLED !== undefined &&
        JSON.parse(
          String(process.env.EXPO_PUBLIC_STORYBOOK_ENABLED).toLowerCase(),
        )
          ? "RootPortalHost"
          : undefined
      }
    >
      {children}
    </Portal>
  );
}
