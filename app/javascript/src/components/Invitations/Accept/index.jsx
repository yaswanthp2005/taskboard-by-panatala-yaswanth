import QUERY_KEYS from "constants/query";
import routes from "constants/routes";

import React, { useCallback, useEffect, useState } from "react";

import invitationsApi from "apis/invitations";
import { NotFound } from "components/commons";
import { Button, Spinner, Toastr, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

const AcceptInvitation = ({ isLoggedIn, match }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { token } = match.params;
  const [invitation, setInvitation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const redirectToDashboard = useCallback(() => {
    history.replace(routes.boards.index);
  }, [history]);

  useEffect(() => {
    const loadInvitation = async () => {
      if (!isLoggedIn) {
        sessionStorage.setItem(
          "invitationRedirect",
          routes.invitations.accept.replace(":token", token)
        );
        history.replace(routes.login);

        return;
      }

      try {
        const { data } = await invitationsApi.show({ token });
        setInvitation(data);
      } catch (error) {
        if (error?.response?.status === 404) {
          setIsNotFound(true);

          return;
        }

        Toastr.error(
          error?.response?.data?.error || t("common.somethingWentWrong")
        );
        redirectToDashboard();
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitation();
  }, [history, isLoggedIn, redirectToDashboard, t, token]);

  const handleAccept = async () => {
    setIsAccepting(true);

    try {
      await invitationsApi.accept({ token });
      await queryClient.invalidateQueries([QUERY_KEYS.BOARDS]);
      redirectToDashboard();
    } catch (error) {
      Toastr.error(
        error?.response?.data?.error || t("common.somethingWentWrong")
      );
      redirectToDashboard();
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isNotFound) {
    return <NotFound />;
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <Typography className="mb-2" style="h3" weight="semibold">
          {t("invitations.acceptTitle")}
        </Typography>
        <Typography className="mb-6 text-gray-600" style="body2">
          {t("invitations.acceptDescription", {
            boardName: invitation.boardName,
            inviterName: invitation.inviterName,
          })}
        </Typography>
        <div className="flex justify-end gap-2">
          <Button
            disabled={isAccepting}
            label={t("common.cancel")}
            style="tertiary"
            onClick={redirectToDashboard}
          />
          <Button
            disabled={isAccepting}
            label={t("invitations.acceptButton")}
            loading={isAccepting}
            style="primary"
            onClick={handleAccept}
          />
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
