import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { redirect } from "../lib";

export const organization = new Elysia()
  .use(ctx)
  .get("/organization", async ({ db, session, set, headers, html, config }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }

    const orgId = session.user.organization_id;

    if (!orgId) {
      redirect({ set, headers }, "/new-user");
      return;
    }

    const organization = await db.query.organizations.findFirst({
      where: (organizations, { eq }) => eq(organizations.id, orgId),
    });

    if (!organization) {
      redirect({ set, headers }, "/new-user");
      return;
    }

    const inviteCode = organization.database_name;
    const ticketCreationUrl = `${config.env.HOST_URL}/${organization.id}/ticket/new`;
    const employees = await db.query.user.findMany({
      where: (user, { eq }) => eq(user.organization_id, orgId),
    });

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="flex-1 space-y-6 py-6">
            <div class="relative flex items-center justify-between px-6 pb-4">
              <h2 class="text-5xl" safe>
                Manage Your Organization - {organization.name}
              </h2>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            <div class="flex flex-col">
              <div class="flex items-center space-x-6 px-6 py-4">
                <span class="text-2xl font-bold">
                  Employee Invite Code:{" "}
                  <span class="pl-4 text-lg font-medium" safe id="orgCode">
                    {organization.database_name}
                  </span>
                </span>
                <button
                  _="on click queue none
                      call copySelectorToClipboard(#orgCode)
                      then set my innerHTML to 'Copied!'
                      then set my classList to 'rounded bg-green-500 px-3 py-2 text-white hover:bg-green-700'
                      then wait 1s
                      then set my innerHTML to 'Copy to Clipboard'
                      then set my classList to 'rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-800'
                  "
                  class="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-800"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div class="flex items-center space-x-6 px-6 py-4">
                <span class="text-2xl font-bold">
                  Customer Create Ticket Link:{" "}
                  <span class="pl-4 text-lg font-medium" safe id="orgUrl">
                    {ticketCreationUrl}
                  </span>
                </span>
                <button
                  _="on click queue none
                      call copySelectorToClipboard(#orgUrl)
                      then set my innerHTML to 'Copied!'
                      then set my classList to 'rounded bg-green-500 px-3 py-2 text-white hover:bg-green-700'
                      then wait 1s
                      then set my innerHTML to 'Copy to Clipboard'
                      then set my classList to 'rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-800'
                  "
                  class="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-800"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>

            <div class="px-6 py-4">
              <h3 class="mb-6 text-2xl font-bold">Employees</h3>
              {!employees || employees.length === 0 ? (
                <p class="text-xl">
                  You have no employees. Have one sign up and use the code to
                  add one.
                </p>
              ) : (
                <ul class="space-y-6">
                  {employees.map((employee) => (
                    <li class="flex items-center justify-between rounded border p-5 shadow-lg">
                      <div class="flex items-center space-x-6">
                        <img
                          src={employee.picture}
                          alt={employee.name}
                          class="h-14 w-14 rounded-full"
                        />
                        <div>
                          <p class="text-xl font-bold" safe>
                            {employee.name}
                          </p>
                          <p class="text-lg text-gray-700" safe>
                            {employee.email || "No Email"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });
