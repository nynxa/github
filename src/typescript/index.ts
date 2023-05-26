import { addAddressButtons, addSectionToggle } from './append'
import { addTagElements, checkNewTagAlert, appendTagLink } from './tag-alert'
import { colorConsole, getAddressDivs } from './utils'
import { processContactDivs } from './contact-divs'
import * as wait from './wait-elements'
import * as constants from './constants'
import { addContactSearchBox } from './search-box'
import { attachSaveAlert } from './save-alert'
import { updatePhoneNumberIcon } from './phone-numbers'

export const appended: ProspectCue = {
    addressDivs: {},
    tagsAdded: [],
    contactDivs: [],
    contactDivTriggers: [],
    searchBox: null,
}

// Initialize the scripts on page load/reload
startProspectCueCustomizations()

async function startProspectCueCustomizations() {
    colorConsole('Starting prospectcue customizations', 'green')
    if (window.location.pathname.includes('/contacts/detail/')) {
        await runContactPageCustomizations()
    }
    if (window.location.pathname.includes('conversations')) {
        colorConsole(
            'reloaded to conversations page, checking for add new tag',
            'yellow'
        )
        await checkNewTagAlert()
    }
    if (window.location.pathname.includes('/opportunities/list')) {
        colorConsole(
            'reloaded to opportunities list page, checking for add new tag',
            'yellow'
        )
        await checkNewTagAlert()
    }

    // watch for clicks on the window

    window.addEventListener('click', handleWindowClicks, { once: true })
}

export async function runContactPageCustomizations() {
    colorConsole('running contact page customizations', 'green')
    try {
        await processContactDivs()
    } catch (e) {
        colorConsole(`error processing contact divs`, 'red', e as Error)
    }
    try {
        await addSectionToggle()
    } catch (e) {
        colorConsole(`error adding section toggle`, 'red', e as Error)
    }
    try {
        // await addContactSearchBox();
        await addAddressButtons()
    } catch (e) {
        colorConsole(`error adding address buttons`, 'red', e as Error)
    }
    try {
        await addTagElements()
    } catch (e) {
        colorConsole(`error adding tag elements`, 'red', e as Error)
    }
    try {
        await attachSaveAlert()
    } catch (e) {
        colorConsole(`error attaching save alert`, 'red', e as Error)
    }
}

function findAncestorWithHref(
    element: EventTarget | null
): HTMLAnchorElement | null {
    colorConsole(`finding ancestor with href`, 'yellow', element as EventTarget)
    while (element) {
        if (
            element instanceof HTMLAnchorElement &&
            element.hasAttribute('href')
        ) {
            return element
        }
        element = (element as HTMLElement).parentElement
    }
    return null
}

function handleWindowClicks(e: MouseEvent) {
    const currentTarget = e.currentTarget as HTMLElement
    const anchor = findAncestorWithHref(currentTarget)

    if (anchor === null) {
        colorConsole(`click was not on an anchor element`, 'yellow')
        return
    }

    const CONTACTS_PATH = '/contacts/detail/'
    const CONVERSATIONS_PATH = '/conversations/conversations'
    const OPPORTUNITIES_PATH = '/opportunities/list'
    const SETTINGS_PHONE_NUMBERS_PATH = '/settings/phone_number?tab=manage'

    colorConsole(`click was on an anchor element: ${anchor?.href}`, 'yellow')
    // set the current url at the time of the click
    const currentPath = window.location.pathname
    setTimeout(async () => {
        const newPath = window.location.pathname
        // dont run if link is an id selector on same page
        if (
            currentPath.includes(CONTACTS_PATH) &&
            newPath.includes(CONTACTS_PATH) &&
            window.location.hash
        ) {
            return
        }
        // Contact Details Page
        if (anchor?.href.includes(CONTACTS_PATH)) {
            await runContactPageCustomizations()
            colorConsole(
                `click on contact page, checking for add new tag`,
                'yellow'
            )
        } else if (
            !currentPath.includes(CONTACTS_PATH) &&
            newPath.includes(CONTACTS_PATH)
        ) {
            // Contact Details Page - click on a within the page.
            colorConsole(
                `click on contact page, checking for add new tag`,
                'yellow'
            )
            await runContactPageCustomizations()
        } else if (window.location.pathname.includes(CONVERSATIONS_PATH)) {
            await checkNewTagAlert()
        } else if (
            currentPath.includes(OPPORTUNITIES_PATH) &&
            window.location.pathname.includes(OPPORTUNITIES_PATH)
        ) {
            await checkNewTagAlert()
        } else if (
            currentPath.includes(SETTINGS_PHONE_NUMBERS_PATH) &&
            window.location.pathname.includes(SETTINGS_PHONE_NUMBERS_PATH)
        ) {
            colorConsole(
                `click on phone number settings page, checking for add new tag`,
                'yellow'
            )
            await updatePhoneNumberIcon()
        }
    }, 500)
}

export {
    wait,
    addTagElements,
    appendTagLink,
    checkNewTagAlert as checkAddNewTag,
    colorConsole,
    startProspectCueCustomizations,
    getAddressDivs,
    addAddressButtons,
    processContactDivs,
    constants,
    addContactSearchBox,
}
