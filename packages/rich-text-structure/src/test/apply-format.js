/**
 * Internal dependencies
 */

import { applyFormat } from '../apply-format';

describe( 'applyFormat', () => {
	const strong = { type: 'strong' };
	const em = { type: 'em' };

	it( 'should apply format', () => {
		const record = {
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			text: 'one two three',
			selection: {},
		};

		const expected = {
			formats: [ , , , [ strong ], [ em, strong ], [ em, strong ], [ em ], , , , , , , ],
			text: 'one two three',
			selection: {},
		};

		expect( applyFormat( record, strong, 3, 6 ) ).toEqual( expected );
	} );

	it( 'should apply format by selection', () => {
		const record = {
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			text: 'one two three',
			selection: {
				start: 3,
				end: 6,
			},
		};

		const expected = {
			formats: [ , , , [ strong ], [ em, strong ], [ em, strong ], [ em ], , , , , , , ],
			text: 'one two three',
			selection: {
				start: 3,
				end: 6,
			},
		};

		expect( applyFormat( record, strong ) ).toEqual( expected );
	} );
} );
