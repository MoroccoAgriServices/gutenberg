/**
 * External dependencies
 */

import { find } from 'lodash';

export function getActiveFormat( { formats, selection }, formatType ) {
	if ( ! selection || selection.start === undefined ) {
		return;
	}

	return find( formats[ selection.start ], { type: formatType } );
}
