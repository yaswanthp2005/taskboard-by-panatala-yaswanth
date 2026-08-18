import routes from "constants/routes";

import React from "react";

import { User } from "neetoicons";
import { Button, Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import withTitle from "utils/withTitle";

import {
  SIGNUP_FORM_INITIAL_VALUES,
  SIGNUP_FORM_VALIDATION_SCHEMA,
} from "./constants";
import { handleSignupSubmit } from "./utils";

const Signup = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-x-2">
          <User size={22} />
          <Typography style="h2" weight="semibold">
            {t("auth.signUp")}
          </Typography>
        </div>
        <div className="mb-6 flex justify-center">
          <Button label={t("auth.orLoginNow")} style="link" to={routes.login} />
        </div>
        <NeetoUIForm
          formikProps={{
            initialValues: SIGNUP_FORM_INITIAL_VALUES,
            validationSchema: SIGNUP_FORM_VALIDATION_SCHEMA,
            onSubmit: (values, formikHelpers) =>
              handleSignupSubmit(values, formikHelpers, history),
          }}
        >
          <div className="flex flex-col gap-y-4">
            <Input
              label={t("auth.firstName")}
              name="firstName"
              placeholder={t("auth.firstNamePlaceholder")}
            />
            <Input
              label={t("auth.lastName")}
              name="lastName"
              placeholder={t("auth.lastNamePlaceholder")}
            />
            <Input
              label={t("auth.email")}
              name="email"
              placeholder={t("auth.emailPlaceholder")}
              type="email"
            />
            <Input
              label={t("auth.password")}
              name="password"
              placeholder={t("auth.passwordPlaceholder")}
              type="password"
            />
            <Input
              label={t("auth.passwordConfirmation")}
              name="passwordConfirmation"
              placeholder={t("auth.passwordPlaceholder")}
              type="password"
            />
            <Button fullWidth label={t("auth.register")} type="submit" />
          </div>
        </NeetoUIForm>
      </div>
    </div>
  );
};

export default withTitle(Signup, "auth.signupPageTitle");
