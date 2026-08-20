# frozen_string_literal: true

Pagy::OPTIONS[:limit] = 10

Pagy::OPTIONS[:data_keys] = %i[
  count
  page
  limit
  last
  previous
  next
  previous_url
  next_url
]

Pagy::OPTIONS.freeze
