export interface SubscriberUser {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  averageRating: number | null;
}

export interface UserSubscription {
  userSubscriptionsId: { userId: number; subscriberId: number };
  user: SubscriberUser;
  subscriber: SubscriberUser;
}
