/// <reference types="cypress" />

context('Querying', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  // The most commonly used query is 'cy.get()', you can
  // think of this like the '$' in jQuery

  it('Has a title', () => {
    cy.get('#metricCardCountries > .title').should('contain', 'Countries');
  });

  it('Comes up with 10 countries', () => {
    cy.wait(10000);
    cy.get('#metricCardCountries > .value').should('contain', '10');
  });

  // https://on.cypress.io/get

  //   cy.get('#query-btn').should('contain', 'Button')

  //   cy.get('.query-btn').should('contain', 'Button')

  //   cy.get('#querying .well>button:first').should('contain', 'Button')
  //   //              ↲
  //   // Use CSS selectors just like jQuery

  //   cy.get('[data-test-id="test-example"]').should('have.class', 'example')

  //   // 'cy.get()' yields jQuery object, you can get its attribute
  //   // by invoking `.attr()` method
  //   cy.get('[data-test-id="test-example"]')
  //     .invoke('attr', 'data-test-id')
  //     .should('equal', 'test-example')

  //   // or you can get element's CSS property
  //   cy.get('[data-test-id="test-example"]')
  //     .invoke('css', 'position')
  //     .should('equal', 'static')

  //   // or use assertions directly during 'cy.get()'
  //   // https://on.cypress.io/assertions
  //   cy.get('[data-test-id="test-example"]')
  //     .should('have.attr', 'data-test-id', 'test-example')
  //     .and('have.css', 'position', 'static')
});
