type NoAuthRoutes = {
  onboarding: undefined;
  login: undefined;
  create_account: undefined;

  forgot_password: {
    type: 'phone' | 'email';
  };
  create_new_password: {
    token: string;
  };
};

export default NoAuthRoutes;
