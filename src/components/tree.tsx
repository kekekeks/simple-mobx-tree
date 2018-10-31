import {observer} from "mobx-react";

import * as React from "react";
import './tree.css'
import {MouseEventHandler} from "react";

export interface TreeViewProps<TNode> {

    getText: (node: TNode) => any,
    getChildren: (node: TNode) => TNode[] | null | undefined,
    getKey: (node: TNode) => string,
    getToggled: (node: TNode) => boolean,
    onToggle: (node: TNode) => void,
    items: TNode[],
    component: (props: {node: TNode}) => any
}

interface ChildrenProps<TNode> {
    tprops: TreeViewProps<TNode>,
    items: TNode[],
    root?: boolean
}

interface NodeProps<TNode> {
    tprops: TreeViewProps<TNode>,
    node: TNode
}


@observer class Node<TNode> extends React.Component<NodeProps<TNode>> {
    private onToggle : MouseEventHandler<HTMLDivElement> = e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.tprops.onToggle(this.props.node);
        return false;
    };

    render() : any
    {
        const props = this.props;
        const tprops = props.tprops;
        const items = tprops.getChildren(props.node);
        const hasItems = items && items.length > 0;
        const isExpanded = hasItems && tprops.getToggled(props.node);
        const Component = tprops.component;
        return <li style={{display: 'list-item'}} className={hasItems ? 'branch' : ''}>
            {hasItems
                ?
                <i className={"indicator glyphicon " + (isExpanded ? "glyphicon-minus-sign" : "glyphicon-plus-sign")}
                   onClick={this.onToggle}/>
                : null
            }
            <div style={{display: 'inline-block', cursor: 'pointer'}}>
                <Component node={props.node}/>
            </div>

            {isExpanded
                ? <Children tprops={tprops} items={tprops.getChildren(props.node)!}/>
                : null}
        </li>
    }
}

@observer class Children<TNode> extends React.Component<ChildrenProps<TNode>> {
    render()
    {
        const props = this.props;
        return <ul className={props.root == true ? 'tree' : ''}>
            {props.items.map(i => {
                return <Node tprops={props.tprops} node={i} key={props.tprops.getKey(i)}/>;
            })}
        </ul>;
    }

}

@observer
export class TreeView<TNode> extends React.Component<TreeViewProps<TNode>> {


    constructor(props: any, ctx: any) {
        super(props, ctx);
    }

    render() {
        const tprops = this.props;
        return <Children<TNode> tprops={tprops} items={tprops.items} root={true}/>;
    }
}