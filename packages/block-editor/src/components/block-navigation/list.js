/**
 * External dependencies
 */
import { isNil, map, omitBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { Slot, Fill } from '@wordpress/components';
import { Children, cloneElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ListItem from './list-item';
import ButtonBlockAppender from '../button-block-appender';
import { BlockListBlockContext } from '../block-list/block';

export default function BlockNavigationList( {
	blocks,
	selectedBlockClientId,
	selectBlock,
	showAppender,
	withSlots,

	// Internal use only.
	showNestedBlocks,
	parentBlockClientId,
} ) {
	const shouldShowAppender = showAppender && !! parentBlockClientId;

	return (
		/*
		 * Disable reason: The `list` ARIA role is redundant but
		 * Safari+VoiceOver won't announce the list otherwise.
		 */
		/* eslint-disable jsx-a11y/no-redundant-roles */
		<ul className="block-editor-block-navigation__list" role="list">
			{ map( omitBy( blocks, isNil ), ( block ) => {
				const isSelected = block.clientId === selectedBlockClientId;
				return (
					<li key={ block.clientId }>
						<ListItemWrapper
							withSlots={ withSlots }
							block={ block }
							isSelected={ isSelected }
							onClick={ () => selectBlock( block.clientId ) }
						/>

						{ showNestedBlocks &&
							!! block.innerBlocks &&
							!! block.innerBlocks.length && (
								<BlockNavigationList
									blocks={ block.innerBlocks }
									selectedBlockClientId={
										selectedBlockClientId
									}
									withSlots={ withSlots }
									selectBlock={ selectBlock }
									parentBlockClientId={ block.clientId }
									showAppender={ showAppender }
									showNestedBlocks
								/>
							) }
					</li>
				);
			} ) }
			{ shouldShowAppender && (
				<li>
					<div className="block-editor-block-navigation__item">
						<ButtonBlockAppender
							rootClientId={ parentBlockClientId }
							__experimentalSelectBlockOnInsert={ false }
						/>
					</div>
				</li>
			) }
		</ul>
		/* eslint-enable jsx-a11y/no-redundant-roles */
	);
}

BlockNavigationList.defaultProps = {
	selectBlock: () => {},
	withSlots: true,
};

const ListItemWrapper = ( { withSlots, ...props } ) => {
	if ( ! withSlots ) {
		return <ListItem { ...props } />;
	}

	return (
		<ListItemSlot blockId={ props.block.clientId }>
			{ ( fills ) => {
				if ( ! fills.length ) {
					return <ListItem { ...props } />;
				}

				return Children.map( fills, ( fill ) =>
					cloneElement( fill, {
						...props,
						...fill.props,
					} )
				);
			} }
		</ListItemSlot>
	);
};

const listItemSlotName = ( blockId ) => `BlockNavigationList-item-${ blockId }`;

export const ListItemSlot = ( { blockId, ...props } ) => (
	<Slot { ...props } name={ listItemSlotName( blockId ) } />
);
export const ListItemFill = ( props ) => {
	const { clientId } = useContext( BlockListBlockContext );
	return <Fill { ...props } name={ listItemSlotName( clientId ) } />;
};
