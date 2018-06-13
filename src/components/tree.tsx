import {observer} from "mobx-react";

import * as React from "react";
import './tree.css'


@observer export default class TreeView<TNode> extends React.Component<{
    getText: (node: TNode) => any,
    getChildren: (node: TNode) => TNode[] | null | undefined,
    getKey: (node: TNode) => string,
    getToggled: (node: TNode) => boolean,
    onToggle: (node: TNode) => void,
    onClick: (node: TNode) => void,
    items: TNode[]
}> {


    render() {
        const tprops = this.props;
        const Children = observer((props: { items: TNode[], root?: boolean }): any =>
            <ul className={props.root == true ? 'tree' : ''}>
                {props.items.map(i => <TreeNode node={i} key={tprops.getKey(i)}/>)}
            </ul>);

        const TreeNode = observer((props: { node: TNode }): any => {
            const items = tprops.getChildren(props.node);
            const hasItems = items && items.length > 0;
            const isExpanded = hasItems && tprops.getToggled(props.node);
            return <li style={{display: 'list-item'}} className={hasItems ? 'branch' : ''}>
                {hasItems
                    ? <i className={"indicator glyphicon " + (isExpanded ? "glyphicon-minus-sign" : "glyphicon-plus-sign")}
                       onClick={e => {
                           e.preventDefault();
                           e.stopPropagation();
                           e.nativeEvent.stopImmediatePropagation();
                           tprops.onToggle(props.node);
                           return false;
                       }
                       }/>
                    : null
                }
                <div style={{display: 'inline-block', cursor: 'pointer'}} onClick={e => {
                    e.preventDefault();
                    tprops.onClick(props.node);
                    return false;
                }}>{tprops.getText(props.node)}</div>

                {isExpanded
                    ? <Children items={tprops.getChildren(props.node)}/>
                    : null}
            </li>
        });

        return <Children items={tprops.items} root={true}/>;
    }
}