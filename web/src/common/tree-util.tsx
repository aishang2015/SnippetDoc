

export class TreeUtil {

    static MakeAntTreeData(data: {
        id: number,
        upId: number | null,
        name: string
    }[], upId: number | null): any[] {
        let result = [];

        let findNodes = data.filter(d => d.upId === upId);
        for (let node of findNodes) {
            let children = this.MakeAntTreeData(data, node.id);
            if (children.length > 0) {
                result.push({
                    title: node.name,
                    value: node.id,
                    children: children
                });
            } else {
                result.push({
                    title: node.name,
                    value: node.id,
                });
            }
        }
        return result;
    }

    
    static MakeAntTreeKeyData(data: {
        id: number,
        upId: number | null,
        name: string
    }[], upId: number | null): any[] {
        let result = [];

        let findNodes = data.filter(d => d.upId === upId);
        for (let node of findNodes) {
            let children = this.MakeAntTreeKeyData(data, node.id);
            if (children.length > 0) {
                result.push({
                    title: node.name,
                    key: node.id,
                    children: children
                });
            } else {
                result.push({
                    title: node.name,
                    key: node.id,
                });
            }
        }
        return result;
    }
}