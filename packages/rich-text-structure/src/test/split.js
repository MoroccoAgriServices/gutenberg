/**
 * Internal dependencies
 */

import { split } from '../split';

describe( 'split', () => {
	const em = { type: 'em' };

	it( 'should split', () => {
		const record = {
			selection: {
				start: 5,
				end: 10,
			},
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			text: 'one two three',
		};

		const expected = [
			{
				selection: {},
				formats: [ , , , , [ em ], [ em ] ],
				text: 'one tw',
			},
			{
				selection: {
					start: 0,
					end: 0,
				},
				formats: [ [ em ], , , , , , , ],
				text: 'o three',
			},
		];

		expect( split( record, 6, 6 ) ).toEqual( expected );
	} );

	it( 'should split with selection', () => {
		const record = {
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			text: 'one two three',
			selection: {
				start: 6,
				end: 6,
			},
		};

		const expected = [
			{
				formats: [ , , , , [ em ], [ em ] ],
				text: 'one tw',
				selection: {},
			},
			{
				formats: [ [ em ], , , , , , , ],
				text: 'o three',
				selection: {
					start: 0,
					end: 0,
				},
			},
		];

		expect( split( record ) ).toEqual( expected );
	} );

	it( 'should split empty', () => {
		const record = {
			formats: [],
			text: '',
			selection: {
				start: 0,
				end: 0,
			},
		};

		const expected = [
			{
				formats: [],
				text: '',
				selection: {},
			},
			{
				formats: [],
				text: '',
				selection: {
					start: 0,
					end: 0,
				},
			},
		];

		expect( split( record ) ).toEqual( expected );
	} );

	it( 'should split search', () => {
		const record = {
			selection: {
				start: 6,
				end: 16,
			},
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , , , , , , , , , , , ],
			text: 'one two three four five',
		};

		const expected = [
			{
				selection: {},
				formats: [ , , , ],
				text: 'one',
			},
			{
				selection: {
					start: 2,
					end: 3,
				},
				formats: [ [ em ], [ em ], [ em ] ],
				text: 'two',
			},
			{
				selection: {
					start: 0,
					end: 5,
				},
				formats: [ , , , , , ],
				text: 'three',
			},
			{
				selection: {
					start: 0,
					end: 2,
				},
				formats: [ , , , , ],
				text: 'four',
			},
			{
				selection: {},
				formats: [ , , , , ],
				text: 'five',
			},
		];

		expect( split( record, ' ' ) ).toEqual( expected );
	} );

	it( 'should split search 2', () => {
		const record = {
			selection: {
				start: 5,
				end: 6,
			},
			formats: [ , , , , [ em ], [ em ], [ em ], , , , , , , ],
			text: 'one two three',
		};

		const expected = [
			{
				selection: {},
				formats: [ , , , ],
				text: 'one',
			},
			{
				selection: {
					start: 1,
					end: 2,
				},
				formats: [ [ em ], [ em ], [ em ] ],
				text: 'two',
			},
			{
				selection: {},
				formats: [ , , , , , ],
				text: 'three',
			},
		];

		expect( split( record, ' ' ) ).toEqual( expected );
	} );
} );
