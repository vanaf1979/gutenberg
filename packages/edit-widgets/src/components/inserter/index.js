/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { Slot, Fill } from '@wordpress/components';
import { Inserter as BlockEditorInserter } from '@wordpress/block-editor';

const disabledInserterToggleProps = { isPrimary: true, disabled: true };

function BlockInserterFill( props ) {
	return <Fill name="EditWidgetsInserter" { ...props } />;
}

function BlockInserterSlot( props ) {
	return (
		<Slot name="EditWidgetsInserter" { ...props }>
			{ ( fills ) => {
				if ( ! isEmpty( fills ) ) {
					return fills;
				}
				return (
					<BlockEditorInserter
						toggleProps={ disabledInserterToggleProps }
					/>
				);
			} }
		</Slot>
	);
}

const Inserter = BlockInserterFill;
Inserter.Slot = BlockInserterSlot;

export default Inserter;
