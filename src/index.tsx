import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import {observable} from "mobx";
import {TreeView} from "./components/tree";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

let nextIdNum = 1;
const nextId = (): string => {
    nextIdNum++;
    return nextIdNum.toString();
}

class MyNode {
    @observable children?: MyNode[] | undefined;
    @observable text: string;
    @observable isToggled: boolean = false;
    @observable key: string = nextId();

    constructor(text: string, items?: MyNode[]) {
        this.text = text;
        this.children = items;
    }

}

class TreeStore {
    @observable items: MyNode[];

}

const treeItems: TreeStore = {
    items: [
        new MyNode('Root1', [
            new MyNode('Item1', [
                new MyNode("SubItem1"),
                new MyNode("SubItem2", [
                    new MyNode("SubSubItem1"),
                    new MyNode("SubSubItem2"),
                ]),
                new MyNode("SubItem3"),
            ]),
            new MyNode('Item2'),
            new MyNode('Item3')

        ])
    ]
};

class MyTreeView extends TreeView<MyNode> {

}

function MyNodeComponent (props:{node:MyNode})
{
    return <div>{props.node.text}</div>
}

ReactDOM.render(
    <MyTreeView items={treeItems.items} getText={i => i.text} getChildren={i => i.children} getKey={i => i.key!}
                getToggled={i => i.isToggled} onToggle={i => i.isToggled = !i.isToggled}
                component={MyNodeComponent}
                />,
    document.getElementById('root') as HTMLElement
);

