export class Family {
    id?: string = "";
    userEmail: string = "";
    createdAt: Date = new Date();
    familyName: string = "";
    familyPic: string = "";
    key: string = "";
    node: Node[] = [];
    edge: any[] = []
    type: "public" | "private" = "public";
    updatedAt: Date = new Date();
}


export class Member {
    id: string = "";
    familyID: string = ""
    name: string = "";
    label: string = "" // value of name   this is to show name in node
    photo: string = "";
    age: string = "";
    phone: string = "";
    country: string = "";
    key: string = ""
    createdBy: {
        id: string,
        email: string
    } = {
            email: '',
            id: ""
        } // user loged in email
}






export class Node {
    id: string = "";
    data: Member = new Member();
    position: Position = new Position();
    type: string = "";
    draggable: boolean = true
}

class Position {
    x: number = 0;
    y: number = 0;
}


export class MarkerEnd {
    color: string = "#FF0072"
}

export class EdgeStyle {
    strokeWidth: number = 2
    stroke: string = "#FF0072"
}