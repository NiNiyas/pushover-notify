const core = require('@actions/core');
const github = require('@actions/github');

const Push = require("pushover-notifications");

async function getDefaultDescription() {
    const context = github.context;
    const payload = context.payload;

    switch (github.context.eventName) {
        case 'push':
            return `<b>${payload.head_commit.committer.name}</b> has pushed <u><i>${context.sha.slice(-7)}</i></u> to  <b>${payload.repository.full_name}</b>.\n\n` +
                `<b>Repo</b>: <a href="${payload.repository.html_url}">${payload.repository.full_name}</a>\n` +
                `<b>Compare</b>: <a href="${payload.compare}">View Here</a>\n` +
                `<b>Author</b>: ${payload.head_commit.author.username}\n` +
                `<b>Committer</b>: ${payload.head_commit.committer.name}\n` +
                `<b>Pusher</b>: ${payload.pusher.name}\n` +
                `<b>Commit URL</b>: <a href="${payload.head_commit.url}/">${context.sha.slice(-7)}</a>\n\n` +
                `<b>Commit Message</b>:\n ${payload.head_commit.message}`;
        case 'release':
            return `<b>${payload.release.author.login}</b> has ${payload.action} <u><i>${payload.release.tag_name}</i></u>.\n\n` +
                `<b>Repo</b>: <a href="${payload.repository.html_url}">${payload.repository.full_name}</a>\n` +
                `<b>Name</b>: ${payload.release.name}\n` +
                `<b>Author</b>: ${payload.release.author.login}\n` +
                `<b>Release URL</b>: <a href="${payload.release.html_url}">${payload.release.tag_name}</a>\n` +
                `<b>Download Tar</b>: <a href="${payload.release.tarball_url}">Here</a>\n` +
                `<b>Download Zip:</b>: <a href="${payload.release.zipball_url}/">Here</a>\n` +
                `<b>PreRelease:</b>: ${payload.release.prerelease}\n\n` +
                `<b>Release Message</b>:\n ${payload.release.body}`;
        case 'schedule':
            return `<b>Event:</b> ${context.eventName}\n` +
                `<b>Repo</b>: <a href="${payload.repository.html_url}">${payload.repository.full_name}</a>\n` +
                `<b>Ref</b>: ${context.ref}\n` +
                `<b>Workflow</b>: ${context.workflow}\n` +
                `<b>Workflow Job Name:</b> ${context.job}\n` +
                `<b>Commit SHA</b>: ${context.sha}`;
        default:
            return `<u><i>${context.workflow}</i></u> has been run in <a href="${payload.repository.html_url}">${payload.repository.full_name}</a>.\n\n` +
                `<b>Workflow Job Name:</b> ${context.job}\n` +
                `<b>Workflow Name:</b> ${context.workflow}\n` +
                `<b>Repo</b>: <a href="${payload.repository.html_url}">${payload.repository.full_name}</a>`
    }
}

async function run() {
        try {
            const usertoken = core.getInput('pushoverUser');
            const apptoken = core.getInput('pushoverApp');

            const priority = core.getInput('priority');
            const details = core.getInput('details');
            const device = core.getInput('device');
            const title = core.getInput('title');
            const sound = core.getInput('sound');
            const url = core.getInput('url');
            const url_title = core.getInput('url_title');
            const retries = core.getInput('retries');
            const expire = core.getInput('expire')

            const context = github.context;
            const obstr = JSON.stringify(context, undefined, 2)
            core.debug(`The event github.context: ${obstr}`);

            const p = new Push({
                user: usertoken,
                token: apptoken,
            })

            core.info(`${priority} ${details} ${device} ${title} ${sound} ${url} ${url_title} ${retries} ${expire}`)

            const msg = {
                message: await getDefaultDescription() + "\n\n" + details,
                priority: (priority || 0),
                device: device,
                title: title,
                sound: sound,
                url: url,
                url_title: url_title,
                expire: expire,
                retries: retries,
                html: 1
            }


            p.send(msg, function(err, result) {
                if (err) {
                    throw err
                }

            })
        } catch (error) {
            core.setFailed(error.message);
        }
    }

        run();
