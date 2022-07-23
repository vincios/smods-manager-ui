export function listJoin(lst: any | any[]): string {
    let check = lst;

    if (!Array.isArray(lst)) {
        check = [lst];
    }

    if (check?.length === 1) {
        return check.pop();
    }

    return check.join(", ")
}