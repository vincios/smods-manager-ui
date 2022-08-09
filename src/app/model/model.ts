export interface ModRevision {
    id: string;
    name: string;
    date: Date;
    download_url: string;
    filename: string;
}


export interface ModBase {
    name: string;
    id: string;
    steam_id: string;
    authors: string | string[];
    published_date: Date;
    size: string;
    has_dependencies: boolean;
    latest_revision: ModRevision;
    steam_url: string;
    url: string;
}

export interface FullMod extends ModBase {
    description: string;
    plain_description: string;
    updated_date: Date;
    dlc_requirements: string[];
    mod_requirements: ModBase[];
    other_revisions: ModRevision[];
    tags: string[];
    category: string;
    image_url: string;
    rating: number;
}

export interface ModDependency extends ModBase {
    required_by: ModBase[];
}

export interface ModCatalogueItem extends ModBase {
    category: string;
    image_url: string;
    rating: number;
}

// APP models

/**
 * Models a state of an operation
 */
export interface TaskOperation {
  op: "install" | "uninstall" | "update";
  state: string;
  [key: string]: any
}

/**
 * Models info about Mod status into the app
 */
export interface ModStatus {
    installed: ModRevision | null; // revision installed
    downloaded: ModRevision[] | null;// revisions downloaded
    starred: boolean;
    playlists: {id: string; name: string}[]; // list of playlists where the mod is present
    installing: boolean; // true during installation process
    operation?:  TaskOperation // current progress operation
}


// Websocket Models
export interface WebsocketMessage<T> {
    type: string;
    channel: string;
    payload: T;
}
