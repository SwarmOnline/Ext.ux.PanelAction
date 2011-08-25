/**
 * Ext.ux.PanelAction
 *
 * @author    		SwarmOnline.com (Stuart Ashworth & Andrew Duncan)
 * @copyright 		(c) 2010, by SwarmOnline.com
 * @date      		29th December 2010
 * @version   		1.0
 * @documentation	http://www.swarmonline.com/2010/12/ext-ux-panelaction-add-action-buttons-to-floating-sencha-touch-panels/
 * @website	  		http://www.swarmonline.com
 *
 * @license Ext.ux.PanelAction.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the 
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.ux.PanelAction = Ext.extend(Object, {

    /**
     * Position - defines where the Icon sits
     * Any combination of 	't' (Top), 'b' (Bottom) or 'c' (Centre) and
     *  					'l' (Left), 'r' (Right) or 'c' (Centre)
     *  For example,
     *  tl = Top Left
     *  br = Bottom Right etc
     */
    position: 'br',
        
    /**
     * Custom offset values to use when positioning the icon
     */
    xOffset: 0,
    yOffset: 0,
    
    /**
     * Base css class of the Element
     * Defines general styles
     * @param {Object} config
     */
    baseClass: 'x-panel-action-icon',
    
    /**
     * CSS Class that provides the icon's image and dimensions and any custom styles
     * needed
     * Mandatory Attributes:
     * 	- background-image
     *  - width
     *  - height
     * @param {Object} config
     */
    iconClass: 'x-panel-action-icon-close',
    
    /**
     * CSS Class that is applied while a User presses the icon
     */
    iconPressedClass: 'x-panel-action-icon-pressed',
    
    /**
     * An array or single value, of function(s) to call following the icon being tapped.
     * This can be a string of a method in the Parent class, an inline function or a reference to a function
     * They will be called in the specified order.
     */
    actionMethod: ['hide'],
    
    constructor: function(config){
        Ext.apply(this, config);
        
        Ext.ux.PanelAction.superclass.constructor.apply(this, arguments);
    },
    
    init: function(parent){
        // cache the reference to parent for later
        this.parent = parent;
        
        // Make it an array if it isn't so we know what we're dealing with
        if (!Ext.isArray(this.actionMethod)) {
            this.actionMethod = [this.actionMethod];
        }
        
        parent.on({
            show: this.onParentShow,
            destroy: this.onParentDestroy,
            resize: this.onParentResize,
            scope: this
        });
    },
    
    /**
     * Create the iconEl when panel is shown
     * @param {Object} component
     */
    onParentShow: function(component){
        if (!this.iconEl) {
			
			// Create the Icon Element
            this.iconEl = component.getEl().createChild({
                cls: this.baseClass + ' ' + this.iconClass
            });
			
			// Cache the element's Width and Height for use later
			this.iconDimensionX = this.iconEl.getWidth();
    		this.iconDimensionY = this.iconEl.getHeight();
            
            // Reposition the Icon
            this.positionIcon();
            
            // Attach Tap events to Icon
            this.iconEl.on({
                touchstart: this.onIconTapStart,
				touchend: this.onIconTap,
                scope: this
            });
        }
    },
    
    /**
     * Handles the Tap Start event, applies a 'pressed' class to the element
     */
    onIconTapStart: function(){
        this.iconEl.addCls(this.iconPressedClass);
    },
    
    /**
     * Handler to resize/reposition icon when the parent is resized
     * @param {Object} component
     * @param {Object} adjWidth
     * @param {Object} adjHeight
     * @param {Object} rawWidth
     * @param {Object} rawHeight
     */
    onParentResize: function(component, adjWidth, adjHeight, rawWidth, rawHeight){
        this.positionIcon();
    },
    
    /**
     * Handler to tidy up after Destroy
     */
    onParentDestroy: function(){
        this.parent.removeListener('show', this.onParentShow, this);
        this.parent.removeListener('resize', this.onParentResize, this);
		this.iconEl.removeListener('touchstart', this.onIconTapStart, this);
        this.iconEl.removeListener('touchend', this.onIconTap, this);
    },
    
    /**
     * Handler for the Tap on the Icon
     */
    onIconTap: function(){
        this.iconEl.removeCls(this.iconPressedClass);
        
        for (var i = 0; i < this.actionMethod.length; i++) {
            this.doCallbackCall(this.actionMethod[i]);
        }
    },
    
    /**
     * Runs the callback method, depending on if it's a reference to a method or the name of one
     * @param {Object} method - Can be string with method name or reference to a function
     */
    doCallbackCall: function(method){
        if (Ext.isFunction(method)) {
            method();
        }
        else {
            this.parent[method]();
        }
    },
    
    /**
     * Positions the Close Icon based on config options
     */
    positionIcon: function(){
        var characters = this.position.split('');
        
        var top = 0;
        var left = 0;
        
        if (characters.length >= 2) {
            var posY = characters[0].toLowerCase();
            var posX = characters[1].toLowerCase();
            
            // Figure out Y position
            switch (posY) {
                case 't':
                    top = -1 * (this.iconDimensionY / 2);
                    break;
                    
                case 'b':
                    top = this.parent.getHeight() - (this.iconDimensionY / 2);
                    break;
                    
                case 'c':
                    top = (this.parent.getHeight() / 2) - (this.iconDimensionY / 2);
                    break
            }
            
            // Figure out X position
            switch (posX) {
                case 'l':
                    left = -1 * (this.iconDimensionX / 2);
                    break;
                    
                case 'r':
                    left = this.parent.getWidth() - (this.iconDimensionX / 2);
                    break;
                    
                case 'c':
                    left = (this.parent.getWidth() / 2) - (this.iconDimensionX / 2);
                    break
            }
            
            // Set the Element with the new positions, adding custom x and y offsets
            this.iconEl.setLeft(left + this.xOffset);
            this.iconEl.setTop(top + this.yOffset);
            
        }
    }
});
