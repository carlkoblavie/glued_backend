'use strict'

const { test, trait } = use('Test/Suite')('Business')

trait('Test/ApiClient')

test('can create a business with valid data', async ({ assert, client }) => {

	const data = {
		name: 'ABC Pharmacy',
		location: 'Sakumono',
		business_type: 'pharmacy'
	}

	const response = await client
		.post('/api/business')
		.send(data)
		.end()

	response.assertStatus(201)
	response.assertJSONSubset({
		name: 'ABC Pharmacy',
		location: 'Sakumono',
		business_type: 'pharmacy'
	})
})

test('cannot create a business if name is missing', async ({ assert, client }) => {
	const Factory = use('Factory')

	const { location, business_type } = await Factory
		.model('App/Models/Business')
		.make()

	const data = {
		location,
		business_type
	}

	const response = await client
		.post('/api/business')
		.send(data)
		.end()

	response.assertStatus(400)
	response.assertJSONSubset([
		{
			message: 'name is required',
			field: 'name',
			validation: 'required'
		}
	])
})

test('cannot create a business if location is missing', async ({ assert, client }) => {
	const Factory = use('Factory')

	const { name, business_type } = await Factory
		.model('App/Models/Business')
		.make()

	const data = {
		name,
		business_type
	}

	const response = await client
		.post('/api/business')
		.send(data)
		.end()

	response.assertStatus(400)
	response.assertJSONSubset([
		{
			message: 'location is required',
			field: 'location',
			validation: 'required'
		}
	])
})

test('cannot create a business if business_type is missing', async ({ assert, client }) => {
	const Factory = use('Factory')

	const { name, location } = await Factory
		.model('App/Models/Business')
		.make()

	const data = {
		name,
		location
	}

	const response = await client
		.post('/api/business')
		.send(data)
		.end()

	response.assertStatus(400)
	response.assertJSONSubset([
		{
			message: 'business_type is required',
			field: 'business_type',
			validation: 'required'
		}
	])
})
