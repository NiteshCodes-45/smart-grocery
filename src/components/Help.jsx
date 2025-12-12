const Help = () => {
  return (
    <div className="help-section" id="help">
        <h2>Help & FAQ</h2>
        <p>Welcome to the Smart Grocery List application! Here are some tips to get you started:</p>

        <h3>Adding Items</h3>
        <p>Use the input field at the top of the grocery list to add new items. You can specify the item name, quantity, and category.</p>
        <h3>Marking Items as Bought</h3>
        <p>Click on an item in the list to toggle its "bought" status. Bought items will be visually distinguished from unbought items.</p>
        <h3>Filtering and Grouping</h3>
        <p>Use the filters at the top of the list to view items based on their status (All, To Buy, Bought) or category. You can also choose to group items by category for easier browsing.</p>
        <h3>Importing and Exporting Data</h3>
        <p>Use the settings menu (⚙️) to import or export your grocery list data in JSON format. This is useful for backing up your data or transferring it between devices.</p>
        <h3>Clearing Data</h3>
        <p>If you want to start fresh, you can use the "Clear All Data" option in the settings menu to remove all items from your list.</p>
        <h3>Need More Help?</h3>
        <p>If you have any questions or need further assistance, feel free to reach out to our support team at <a href="mailto:hello@niteshchaughule.dev">hello@niteshchaughule.dev</a>.</p>
    </div>
  );
}
export default Help;