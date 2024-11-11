export function get2dimensional<T>(array: T[] | undefined, limit: number) {
    const array2: T[][] = [];
    let section: T[] = [];

    for (const [index, element] of (array || []).entries()) {
        if (index % limit === 0) {
            section = [];
            array2.push(section)
        }
        section.push(element);
    }

    return array2;
}
