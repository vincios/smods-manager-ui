export interface ModRevision {
    name: string;
    date: Date;
    download_url: String;
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
    revisions: ModRevision[];
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