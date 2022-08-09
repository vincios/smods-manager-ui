import get from "lodash-es/get";
import set from "lodash-es/set";
import { FullMod, ModBase } from "../model/model";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";

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


export function modTypeString(mod: ModBase | FullMod): "base" | "full" {
    return "description" in  mod ? "full" : "base";
}

/**
 * Returns all key paths of a complex object in list form.
 * @example
 *    const obj = {
 *   "First": {
 *     "Second": {
 *       "Fourth": {
 *         "GROSS": 1833
 *       },
 *       "Fifth": {
 *         "GROSS": 2442
 *       }
 *     },
 *     "Third": {
 *       "Sixth": {
 *         "GROSS": 1721
 *       }
 *     }
 *   }
 * };
 * const test = paths(obj);
 * [["First"], ["First","Second"], ["First","Third"], ["First","Second","Fourth"],
 * ["First","Second","Fifth"], ["First","Third","Sixth"]]
 *
 * const test = paths(obj, true); // onlyFulls = true; includeLeafs = false
 * [["First","Second","Fourth"], ["First","Second","Fifth"], ["First","Third","Sixth"]]
 *
 * const test = paths(obj, true, true); // onlyFulls = true; includeLeafs = true
 * [["First","Second","Fourth", "GROSS"], ["First","Second","Fifth", "GROSS"], ["First","Third","Sixth", "GROSS"]]
 * @see https://lowrey.me/getting-all-paths-of-an-javascript-object/
 * @param root object to analyze
 * @param onlyFull whether return only full path (i.e. only paths from root to the leaf set with <i>includeLeaf</i>
 * @param includeLeafs whether include also the leafs (i.e. paths to entries that holds values
 * @param isLeaf a function called for each node that determines if it is a leaf.
 * By default, each node that is not an object will be considered as a leaf.
 */
export function paths(root: {[key: string]: any}, onlyFull: boolean = false, includeLeafs: boolean = false,
                      isLeaf: (value: any) => boolean = (obj) => typeof obj === 'object'): string[][] {
    const paths: string[][] = [];
    const nodes: {obj: object; path: string[]}[] = [{
        obj: root,
        path: []
    }];

    while (nodes.length > 0) {
        const n = nodes.pop();
        Object.keys(n!.obj).forEach(k => {
            const path = n!.path.concat(k);
            // if (typeof n!.obj[k] === 'object') { // until obj[k] is an object we have not reached yet a leaf
            if(!isLeaf(n!.obj[k])) { // if node is not a leaf we have to dig into it
                nodes.unshift({
                    obj: n!.obj[k],
                    path: path
                });
                if (!onlyFull) paths.push(path);
            } else { // obj[k] is a leaf
                if (includeLeafs) {
                    paths.push(path);
                } else if (onlyFull) {
                    // includeLeaf is false, the full path of a leaf is the path of its parent
                    // but onlyFull is true, the path of its parent wasn't added on the paths array,
                    // so we have to add it here.
                    // But, since a parent could have multiple leafs, we have also check that the parent wasn't already
                    // added by another sibling
                    if (!paths.includes(n!.path)) {
                        paths.push(n!.path); // n is the parent of the leaf
                    }
                }
            }
        });
    }
    return paths;
}

export function extend(obj: object, src: object) {
    const pathsToUpdate = paths(src, true, true);
    for (const path of pathsToUpdate) {
        set(obj, path, get(src, path));
    }
}


export function openSnackbar(snackBar: MatSnackBar, text: string, duration?: number, actionText?: string, actionCallback?: () => void): MatSnackBarRef<any> {
    const snackBarRef = snackBar.open(text, actionText, {duration: duration});

    if (actionText) {
        snackBarRef.onAction().subscribe(actionCallback);
    }

    return snackBarRef;
}
