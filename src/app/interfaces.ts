export interface Book {
    id: number;
    title: string;
    publisher: string;
    pageCaunt: number;
    maturityRating: string;
    imageLinks: imageLink;
    language: string;
    webReaderLink: string;
}


export interface imageLink {
    smallThumbnail?: string;
    thumbnail?: string;
}
