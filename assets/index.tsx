import { Image as ExpoImage } from "expo-image";
import { DimensionValue } from "react-native";

export const fonts = {
  AcuminProWideLight: require("./fonts/Acumin Pro Wide/Acumin Pro Wide Light.otf"),
  AcuminProWideSemibold: require("./fonts/Acumin Pro Wide/Acumin Pro Wide Semibold.otf"),
  Olyford: require("./fonts/Olyford/Fontspring-DEMO-olyford-extrabold.otf"),
};

export const icons = {
  crown: require("@/assets/icons/crown.png"),
  crown_gray: require("@/assets/icons/crown_gray.png"),
  remove_member: require("@/assets/icons/remove_member.png"),
  chevron_left: require("@/assets/icons/chevron_left.png"),
  chevron_right: require("@/assets/icons/chevron_right.png"),
  gear: require("@/assets/icons/gear.png"),
  pencil: require("@/assets/icons/pencil.png"),
  friend: require("@/assets/icons/friend.png"),
  hive: require("@/assets/icons/hive.png"),
  accept: require("@/assets/icons/accept.png"),
  reject: require("@/assets/icons/reject.png"),
};

export type IconName = keyof typeof icons;

export const Icon = ({
  name,
  size,
}: {
  name: IconName;
  size?: DimensionValue;
}) => {
  return (
    <ExpoImage
      source={icons[name]}
      style={{ width: size ?? 24, height: size ?? 24 }}
    />
  );
};

export const logo = require("@/assets/logo/adaptive-icon.png");

export const LogoIcon = ({ size }: { size?: DimensionValue }) => {
  return (
    <ExpoImage
      source={logo}
      style={{ width: size ?? 144, height: size ?? 144 }}
    />
  );
};

export const navs = {
  home: require("@/assets/nav/home.png"),
  search: require("@/assets/nav/search.png"),
  add_streak: require("@/assets/nav/add_streak.png"),
  notification: require("@/assets/nav/notification.png"),
  profile: require("@/assets/nav/profile.png"),
};

export type NavIconName = keyof typeof navs;

export const NavIcon = ({
  name,
  size,
}: {
  name: NavIconName;
  size?: DimensionValue;
}) => {
  return (
    <ExpoImage
      source={navs[name]}
      style={{ width: size ?? 24, height: size ?? 24 }}
    />
  );
};

export const reactions = {
  default: {
    heart: require("@/assets/reactions/default/heart.png"),
    sob: require("@/assets/reactions/default/sob.png"),
    angry: require("@/assets/reactions/default/angry.png"),
    joy: require("@/assets/reactions/default/joy.png"),
  },
  selected: {
    heart: require("@/assets/reactions/selected/heart.png"),
    sob: require("@/assets/reactions/selected/sob.png"),
    angry: require("@/assets/reactions/selected/angry.png"),
    joy: require("@/assets/reactions/selected/joy.png"),
  },
};

export type ReactionVariantName = keyof typeof reactions;
export type ReactionIconName<V extends ReactionVariantName> =
  keyof (typeof reactions)[V];

export const ReactionIcon = <V extends ReactionVariantName>({
  variant,
  name,
  size,
}: {
  variant: V;
  name: ReactionIconName<V>;
  size?: DimensionValue;
}) => {
  return (
    <ExpoImage
      // @ts-ignore
      source={reactions[variant][name]}
      style={{ width: size ?? 24, height: size ?? 24 }}
    />
  );
};
