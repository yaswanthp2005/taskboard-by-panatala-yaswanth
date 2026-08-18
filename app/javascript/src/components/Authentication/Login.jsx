import routes from "constants/routes";

import React from "react";

import { Lock } from "neetoicons";
import { Button, Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";
import withTitle from "utils/withTitle";

import {
  LOGIN_FORM_INITIAL_VALUES,
  LOGIN_FORM_VALIDATION_SCHEMA,
} from "./constants";
import { handleLoginSubmit } from "./utils";

const Login = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-x-2">
          <Lock size={22} />
          <Typography style="h2" weight="semibold">
            {t("auth.signIn")}
          </Typography>
        </div>
        <div className="mb-6 flex justify-center">
          <Button
            label={t("auth.orRegisterNow")}
            style="link"
            to={routes.signup}
          />
        </div>
        <NeetoUIForm
          formikProps={{
            initialValues: LOGIN_FORM_INITIAL_VALUES,
            validationSchema: LOGIN_FORM_VALIDATION_SCHEMA,
            onSubmit: handleLoginSubmit,
          }}
        >
          <div className="flex flex-col gap-y-4">
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
            <Button fullWidth label={t("auth.signIn")} type="submit" />
          </div>
        </NeetoUIForm>
      </div>
    </div>
  );
};

export default withTitle(Login, "auth.loginPageTitle");
