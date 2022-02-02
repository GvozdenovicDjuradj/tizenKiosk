export interface KioskIdAndDomain {
    kioskId: string;
    domain: string;
}

export const getKioskIdAndDomainFromWindow = (): KioskIdAndDomain => {
    const url = new URL(window.location.href)
    const kioskId = url.searchParams.get("kioskId") || ""
    const domain = url.searchParams.get("domain") || ""

    return {
        kioskId,
        domain
    }
}
