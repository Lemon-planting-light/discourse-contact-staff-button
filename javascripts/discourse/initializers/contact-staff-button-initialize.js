import Composer from "discourse/models/composer";
import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";


export default {
    name: "contact-staff-button",
    initialize() {
        withPluginApi("1.0.0", api => {
            const currentUser = api.getCurrentUser();
            if (!currentUser) return;

            if (
                currentUser.staff ||
                currentUser.trust_level >= settings.min_trust_level
            ) {
                function getBody(e) {
                    const strLink = ` [${window.document.title}](${e.shareUrl}) `;
                    let strSelected = window.getSelection().toString();
                    if (strSelected != '') { strSelected = `\n${settings.content_of}\n[quote]\n${strSelected}\n[/quote]\n`; }

                    return settings.about_post + strLink + strSelected + `\n\n${settings.end_greeting}\n`;
                }
                function getTitle() {
                    return `${settings.title_topic}${window.document.title}${settings.title_end}`;
                }
                api.attachWidgetAction("post-menu", "messageSend", function () {
                    console.log(this.attrs)
                    const composerController = getOwner(this).lookup("controller:composer");

                    composerController.open({
                        action: Composer.PRIVATE_MESSAGE,
                        draftKey: Composer.NEW_PRIVATE_MESSAGE_KEY,
                        recipients: settings.recipients,
                        topicTitle: getTitle(),
                        topicBody: getBody(this.attrs),
                        archetypeId: "private_message",
                    });
                });

                api.addPostMenuButton("message-send", () => {
                    return {
                        action: "messageSend",
                        icon: settings.svg_icon,
                        className: "message-send",
                        title: themePrefix("button_title"),
                        position: "second-last-hidden"
                    };
                });
            }
        });
    }
};

