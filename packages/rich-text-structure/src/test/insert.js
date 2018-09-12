/**
 * Internal dependencies
 */

import { insert } from '../insert';

describe( 'insert', () => {
	const em = { type: 'em' };
	const strong = { type: 'strong' };

	it( 'should delete and insert', () => {
		const record = {
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			text: 'one two three',
			start: 6,
			end: 6,
		};

		const toInsert = {
			formats: [ [ strong ] ],
			text: 'a',
		};

		const expected = {
			formats: [ , , [ strong ], [ em ], , , , , , , ],
			text: 'onao three',
			start: 3,
			end: 3,
		};

		expect( insert( record, toInsert, 2, 6 ) ).toEqual( expected );
	} );

	it( 'should insert line break with selection', () => {
		const record = {
			formats: [ , , ],
			text: 'tt',
			start: 1,
			end: 1,
		};

		const toInsert = {
			formats: [ , ],
			text: '\n',
		};

		const expected = {
			formats: [ , , , ],
			text: 't\nt',
			start: 2,
			end: 2,
		};

		expect( insert( record, toInsert ) ).toEqual( expected );
	} );
} );
