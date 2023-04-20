import { addAddressButtons, addSectionToggle } from './append';
import { addTagElements, checkAddNewTag, appendTagLink } from './tag-alert';
import { colorConsole, getAddressDivs } from './utils';
import { processContactDivs } from './contact-divs';
import * as wait from './wait-elements';
import * as constants from './constants';
import { addContactSearchBox } from './search-box';

startProspectCueCustomizations();

export const appended: ProspectCue = {
    addressDivs: {},
    tagsAdded: [],
    contactDivs: [],
    contactDivTriggers: [],
    searchBox: null,
};

export async function runContactPageCustomizations() {
    colorConsole('running contact page customizations', 'green');
    await processContactDivs();
    // await addContactSearchBox();
    await addSectionToggle();
    await addAddressButtons();
    await addTagElements();
}

async function startProspectCueCustomizations() {
    colorConsole('Starting prospect cue customizations', 'green');

    if (window.location.pathname.includes('/contacts/detail/')) {
        await runContactPageCustomizations();
    }
    if (window.location.pathname.includes('conversations')) {
        colorConsole(
            'reloaded to conversations page, checking for add new tag',
            'yellow'
        );
        await checkAddNewTag();
    }
    if (window.location.pathname.includes('/opportunities/list')) {
        colorConsole(
            'reloaded to opportunities list page, checking for add new tag',
            'yellow'
        );
        await checkAddNewTag();
    }
    window.addEventListener(
        'click',
        function watchWindowClicks(e: MouseEvent) {
            const currentUrl = window.location.pathname;

            setTimeout(async () => {
                colorConsole(
                    `current URL -> pathname 500ms later... = ${currentUrl} -> ${window.location.pathname}`,
                    'yellow'
                );
                const target = e.target as HTMLAnchorElement;
                if (target.href && target.href.includes('/contacts/detail/')) {
                    await runContactPageCustomizations();
                } else if (
                    !currentUrl.includes('/contacts/detail/') &&
                    window.location.pathname.includes('/contacts/detail/')
                ) {
                    await runContactPageCustomizations();
                } else if (
                    window.location.pathname.includes(
                        '/conversations/conversations'
                    )
                ) {
                    await checkAddNewTag();
                } else if (
                    currentUrl.includes('/opportunities/list') &&
                    window.location.pathname.includes('/opportunities/list')
                ) {
                    await checkAddNewTag();
                }
            }, 500);
        },
        true
    );
}

export {
    wait,
    addTagElements,
    appendTagLink,
    checkAddNewTag,
    colorConsole,
    startProspectCueCustomizations,
    getAddressDivs,
    addAddressButtons,
    processContactDivs,
    constants,
    addContactSearchBox,
};
